'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import path from 'path'
import yaml from 'js-yaml'
import {remote} from 'electron'
import fs from 'fs'

import '../assets/index.scss'

const exec = require('child_process').exec;

class FileItem extends React.Component {
    constructor(props) {
        super(props)
        this.openFile = this.openFile.bind(this)
    }

    openFile(app, filePath) {
        const appOpt = app ? `-a ${app}` : ''
        exec(`open ${appOpt} ${filePath}`, function (error, stdout, stderr) {
            if (error !== null) {
                alert(error)
            }
        })
    }

    render() {
        const links = this.props.links.map((link) => {
            return (
                <span key={link.app + link.filePath}><a href=''
                                                        onClick={this.openFile.bind(null, link.app, link.path)}>{link.title}</a></span>
            )
        })
        return (
            <li><span>{this.props.title}</span>
                {links}
            </li>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.parseConfig = this.parseConfig.bind(this)
        this.contents = {}
    }

    componentWillMount() {
        document.title = "Navi"

        const shared = remote.getGlobal('shared')
        const configPath = path.join(shared.dataPath, '_config.yml')
        let data = null
        try {
            data = yaml.safeLoad(fs.readFileSync(configPath, {encoding:'utf8'}));
        } catch (e) {
            alert(e)
            data = null
        }
        if(data) {
            try {
                this.parseConfig(data)
            } catch (e) {
                alert("parsing config error: " + e)
            }
        }
    }

    parseConfig(data) {
        Object.keys(data).forEach((key) => {
            const group_raw = data[key]
            const basePath = group_raw._path || ''
            delete group_raw._path
            let group = {}
            Object.keys(group_raw).forEach((subkey) => {
                const items_raw = group_raw[subkey]
                const items = items_raw.map((item_raw) => {
                    let item = {
                        title: item_raw[0],
                        app: item_raw[1]
                    }
                    if (item_raw[2] && item_raw[2].startsWith(path.sep)) {
                        item.path = items_raw[2]
                    } else {
                        item.path = path.join(basePath, item_raw[2])
                    }
                    return item
                })
                group[subkey] = items
                return group
            })
            this.contents[key] = group
        })
    }

    componentDidMount() {

    }

    render() {
        const divs = Object.keys(this.contents).map((category,idx) => {
            console.log(category)
            const group = this.contents[category]
            const items = Object.keys(group).map((name)=>{
                return <FileItem key={name+idx} title={name} links={group[name]} />
            })
            return (
                <div key={category+idx}>{category}
                    <ul>
                        {items}
                    </ul>
                </div>)
        })
        return (
            <>
            {divs}
            </>
        )
    }
}

const app = document.querySelector('#app');
ReactDOM.render(<App/>, app);