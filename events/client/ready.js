module.exports = async (client) => {


  client.user.setActivity(`+help`, {
    type: 'PLAYING'
  },
  {
    status: 'online'
  });

  console.log(`El bot: ${client.user.username} esta en linea`);

};