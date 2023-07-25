const mongoose = require('mongoose');
const Document = require('./document');
mongoose.connect('mongodb://127.0.0.1:27017/google-docs');


const io = require('socket.io')(3001,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['Get','Post'],
    },
});

// socket.io provides additional guarantees like fallback to HTTP long-polling or automatic reconnection.
const Defaultvalue = "";
io.on("connection",(socket)=>{ // this is like waht to do after connection and socket is aserverside class/instancce 
    console.log("connection stablished with Id:",socket.id) //two different browser tabs will have two different IDs regenerated on every refresh
    socket.on('get-document', async (documentId) => {
        const docs = await FindOrCreateById(documentId);
        socket.join(documentId);
        socket.emit('load-document',docs.data);
        socket.on("send-changes", (delta) => {
            //    console.log(delta);
            // socket.emit("recieve-changes", delta) // To all connected clients
            socket.broadcast.to(documentId).emit("recieve-changes", delta) //To all connected clients except the sender 
            // .to() to sending to a particulatr room of DocumrntId
        })

        socket.on("save-document", async data=>{
            await Document.findByIdAndUpdate(documentId,{data});
        });
        
    });
})


async function FindOrCreateById(Id){
    if(Id == null){
        return;
    }
    const document = await Document.findById(Id);
    if(document) return document;

    return await Document.create({_id: Id,data: Defaultvalue})
}