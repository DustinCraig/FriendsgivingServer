const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const Joey = 'joey'
const Kaylee = 'kaylee'
const Makenzi = 'makenzi'
const Dustin = 'dustin'
const Daniel = 'daniel'
const Anna = 'anna-kedron'
const startingNames = [Joey, Kaylee, Makenzi, Daniel, Dustin, Anna]
let availableNames = [Joey, Kaylee, Makenzi, Daniel, Dustin, Anna]
let pickedNames = []

app.use(express.static('monitor'))
app.use(express.static(__dirname + '/monitor'))
app.use(cors())
app.options('*', cors())

const rewriteNames = (names) => {
    let str = ''
    names.map((name) => {
        str += name + '\n'
    })
    fs.writeFile('names.txt', str, (err) => {})
}

const checkRelationships = (name, clone) => {
    if (name === Kaylee && clone.indexOf(Joey) > -1)
        clone.splice(clone.indexOf(Joey), 1)
    else if (name === Joey && clone.indexOf(Kaylee) > -1)
        clone.splice(clone.indexOf(Kaylee), 1)
    else if (name === Daniel && clone.indexOf(Makenzi) > -1)
        clone.splice(clone.indexOf(Makenzi), 1)
    else if (name === Makenzi && clone.indexOf(Daniel) > -1)
        clone.splice(clone.indexOf(Daniel), 1)
    else if (name === Dustin && clone.indexOf(Anna) > -1)
        clone.splice(clone.indexOf(Anna), 1)
    else if (name === Anna && clone.indexOf(Dustin) > -1)
        clone.splice(clone.indexOf(Dustin), 1)
}

app.get('/name', (req, res) => {
    if (!req.query.name) res.end('Unknown')
    const name = req.query.name.toLowerCase()

    if (availableNames.length == 0) {
        // If there are no more names left, return a random one
        const clone = [...startingNames]
        clone.splice(clone.indexOf(name), 1)
        checkRelationships(name, clone)
        res.end(clone[Math.floor(Math.random() * clone.length)])
    }

    const clone = [...availableNames]
    if (clone.find(e => e === name)) 
        clone.splice(clone.indexOf(name), 1)
    checkRelationships(name, clone)
    const randomName = clone[Math.floor(Math.random() * clone.length)]
    availableNames.splice(availableNames.indexOf(randomName), 1)
    rewriteNames(availableNames)
    res.end(randomName)
})

app.get('/reset', (req, res) => {
    fs.writeFile('names.txt', 'anna-kedron\ndustin\ndanny\ndaniel\nmakenzi\njoey\nkaylee\n', (err) => { })
    availableNames = startingNames
    pickedNames = []
    res.end('reset')
})

app.listen(8080)