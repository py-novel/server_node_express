import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import jwt from '@apacejs/jwt'

import { whiteList, apiPrefix, serverPort } from './config'
import router from './router'

import * as errorHandler from './middleware/errorHandler'
import ignoreFavicon from './middleware/ignoreFavicon'
import logger from './middleware/logger'
import trunApiprefix from './middleware/trunApiprefix'

const app = express()

app.use(morgan('dev'))                  // 打印请求信息

// Ignore favicon
app.use(ignoreFavicon())

// Logger
app.use(logger())

// Parse Params
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Truncate ApiPrefix
app.use(trunApiprefix(apiPrefix))

// Jwt Authentication
app.use(jwt.verify({ whiteList }))

// Router
router(app)

// Error Handler
app.use(errorHandler.notFoundErrorHandler())
app.use(errorHandler.errorHandler())

app.listen(serverPort, function () {
    console.log(`server is starting on port: ${serverPort}.`)
})