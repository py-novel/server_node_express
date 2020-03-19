import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import jwt from '@apacejs/jwt'

import { whiteList, apiPrefix, serverPort } from './config'
import router from './router'

import ignoreFavicon from './middlewares/ignoreFavicon'
import logger from './middlewares/logger'
import trunApiprefix from './middlewares/trunApiprefix'

const app = express()

app.use(morgan('dev'))                  // 打印请求信息

app.use(bodyParser.urlencoded({ extended: false }))     // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                             // parse application/json

app.use(ignoreFavicon())                // ignore favicon.ico
app.use(logger())                       // print log
app.use(trunApiprefix(apiPrefix))
app.use(jwt.verify({ whiteList }))      // jwt authentication

router(app)

app.listen(serverPort, function () {
    console.log(`server is starting on port: ${serverPort}.`)
})