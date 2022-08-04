directory structure<br/>
api/<br/>
  aaa.js<br/>
  bbb.get.js<br/>
  ccc.post.js<br/>
  test1/index.js<br/>
  test2/[xxx].get.js<br/>
  test3/[...xxx].get.js<br/>
<br/>
example<br/>
//    api/aaa.js<br/>
<br/>
export default (req,res)=>{<br/>
    res.end("works");<br/>
}<br/>
<br/>
express<br/>
import express from 'express'<br/>
import {AutoLoad} from 'auto-use-routes'<br/>
let router = await AutoLoad(express.Router(),path.join(__dirname,'/api'))<br/>
app.use('/api',router)<br/>
<br/>
fastify<br/>
import {AutoLoad} from 'auto-use-routes'<br/>
.....<br/>
let plugin = async(fastify, opts, done)=> {<br/>
    await AutoLoad(fastify,path.join(__dirname,'./server/api'),{log:true});<br/>
}<br/>
fastify.register(plugin, {prefix: '/api'})<br/>
