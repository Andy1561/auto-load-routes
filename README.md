## Installation
npm install auto-use-routes --save

## Usage
#### directory structure  
<pre>
api/  
    aaa.js  
    bbb.get.js  
    ccc.post.js  
    test1/index.js  
    test2/[xxx].get.js  
    test3/[...xxx].get.js  

</pre>
api/aaa.js  
<pre>
export default (req,res)=>{  
    res.end("works");  
}  
</pre>
### express
<pre>
import express from 'express'  
import {AutoLoad} from 'auto-use-routes'  
let router = await AutoLoad(express.Router(),path.join(__dirname,'/api'))  
app.use('/api',router)  
</pre>
### fastify
<pre>
import {AutoLoad} from 'auto-use-routes'  
.....  
let plugin = async(fastify, opts, done)=> {  
    await AutoLoad(fastify,path.join(__dirname,'./server/api'),{log:true});  
}  
fastify.register(plugin, {prefix: '/api'})
</pre>