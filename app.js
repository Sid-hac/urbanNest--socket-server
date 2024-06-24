
import {Server} from "socket.io"

const io = new Server({
    cors:{
        origin:  "https://urbannnest.netlify.app"
    }
})

const port = process.env.PORT || 4000

  let onlineUsers = [];
 
  const addUser = (userId , socketId) => {
      
    const userExists = onlineUsers.find(user => user.userId === userId)
    if(!userExists){
        onlineUsers.push({
            userId,
            socketId
        })
    }
  }

  const removeUser = (socketId) => {
       
       onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
  }

  const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId)
}


io.on("connection",(socket)=>{
    
    socket.on("newUser" , (userId) =>{
       addUser(userId, socket.id);
       console.log(onlineUsers);
    })

    socket.on("newMessage", ({receiverId , data}) => {
        const user = getUser(receiverId);
        if(user){
            io.to(user.socketId).emit("getMessage" , data)
        }
    })

    socket.on("disconnect" , () => {
        removeUser(socket.id);
    })

});

io.listen(port)