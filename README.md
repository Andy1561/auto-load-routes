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
import loadRouter from 'auto-use-routes'
import path from 'path'
const app = express()
let router = await loadRouter(express.Router(),path.join(path.resolve(),'/api'),{printlog:true})
app.use('/api',router)
app.listen(3000);
</pre>
### fastify
<pre>
import loadRouter from 'auto-use-routes'  
.....  
let plugin = async(fastify, opts, done)=> {  
    await loadRouter(fastify,path.join(path.resolve(),'./server/api'),{printlog:true});  
}  
fastify.register(plugin, {prefix: '/api'})
</pre>