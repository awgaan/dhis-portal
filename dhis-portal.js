#!/usr/bin/env node

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { getInstanceUrl } = require('./instances')

const defaultOpts = {
    server: null,
    instance: null,
    target: null,
    auth: undefined,
    port: 9999,
    verbose: false,
}

const createOpts = args => {
    const opts = { ...defaultOpts }
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg.indexOf('--port=') > -1) {
            const portString = arg.substring(7)
            const portNumber = parseInt(portString, 10)
            if (portNumber === +portString) {
                opts.port = portNumber
            }
        }

        if (arg.indexOf('--server=') > -1) {
            const server = arg.substring(9)
            opts.server = server
        }

        if (arg.indexOf('--instance=') > -1) {
            const instance = arg.substring(11)
            opts.instance = instance
        }

        if (arg.indexOf('--target=') > -1) {
            const target = arg.substring(9)
            opts.target = target
        }

        if (arg.indexOf('--auth=') > -1) {
            const auth = arg.substring(7)
            opts.auth = auth
        }

        if (arg.indexOf('--verbose') > -1) {
            opts.verbose = true
        }
    }

    if (opts.target) {
        opts.server = null
        opts.instance = null
    } else if (opts.server != null) {
        try {
            opts.target = getInstanceUrl(opts.server, opts.instance)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }

    return opts
}

const verifyOpts = opts => {
    if (!opts.target && !opts.server && !opts.instance) {
        throw 'target of portal not specified'
    }
}

let sessionCookie = ''
const onProxyReq = proxyReq => {
    if (sessionCookie) {
        proxyReq.setHeader('cookie', sessionCookie)
    }
}
const onProxyRes = proxyRes => {
    const proxyCookie = proxyRes.headers['set-cookie']
    if (proxyCookie) {
        sessionCookie = proxyCookie
    }
}

const Portal = {
    start: (opts = defaultOpts) => {
        try {
            verifyOpts(opts)
        } catch (err) {
            console.error(`ERROR: ${err}`)
            Portal.usage()
            process.exit(1)
        }
        const app = express()
        app.use(
            '/',
            createProxyMiddleware({
                target: opts.target,
                changeOrigin: true,
                onProxyReq,
                onProxyRes,
                auth: opts.auth,
                logLevel: opts.verbose ? 'debug' : 'silent',
            })
        )

        console.log(
            `Portal from localhost:${opts.port} -> ${opts.target} created!`
        )
        app.listen(opts.port)
    },
    usage: () => {
        console.log(
            `USAGE: dhis2-portal --server=<server-name>
                    --instance=<instance-name>
                    [--port=<port>]
                    [--target=<instance-url>]
                    [--auth=auth]
                    [--verbose]`
        )
    },
}

Portal.start(createOpts(process.argv))

module.exports = Portal
