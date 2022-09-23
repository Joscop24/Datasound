exports.getTopArtist = (token, time) => {
    let convert_time = ""

    switch (time.toString()) {
        case '4w':
            convert_time = "short_term"
            break;
        case '6m':
            convert_time = "medium_term"
            break;
        case 'all':
            convert_time = "long_term"
            break;
        default:
            convert_time = "short_term"
            break
    }

    return new Promise( async (resolve, reject) => {
        // const token = req.session.token
        const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${convert_time}&limit=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        })
        // console.log("resultat", result);
      
        const datas6M = await result.json()
        let topArray = []

        datas6M.items.map((itm, i) => {
            console.log('loop', i)
            if (i <= 2) topArray.push({
              ...itm,
              images: itm.images[0]
            })
          })

        resolve(datas6M, topArray)
    })
}

// await getArtist(req.session.token, '4w')
