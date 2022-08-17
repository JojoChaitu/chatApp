

const chatRoom =  async (req,res)=>{
    res.status(200).json('you are in the chat room!')
}

module.exports = { chatRoom }