module.exports = async (client, error) => {
    client.user.setActivity(`+help`, {
        type: 'PLAYING'
      },
      {
        status: 'idle'
      });
};