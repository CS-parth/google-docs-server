const io = require('socket.io')(3001,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['Get','Post']
    },
});


io.on("connection",(socket)=>{
    console.log("connection stablished")
    socket.on("send-changes", (delta) => {
        //    console.log(delta);
        socket.broadcast.emit("recieve-changes", delta) 
    })
})