import firebase from "firebase";

class Firebase {
  getOrders = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  storage = () => {
    return firebase.storage()
  }

  getRimiSenTitles = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimiLyrics/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  updateOrderInfo = (orderId, detailsToUpdate) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + orderId + '/')
      .update(
        {
          id: detailsToUpdate?.id?.length > 0 ? detailsToUpdate.id : '',
          emailAddress: detailsToUpdate?.emailAddress?.length > 0 ? detailsToUpdate.emailAddress : '',
          igname: detailsToUpdate?.igname?.length > 0 ? detailsToUpdate.igname : '',
          firstName: detailsToUpdate?.firstName?.length > 0 ? detailsToUpdate.firstName : '',
          lastName: detailsToUpdate?.lastName?.length > 0 ? detailsToUpdate.lastName : '',
          reelPurpose: detailsToUpdate?.reelPurpose?.length > 0 ? detailsToUpdate.reelPurpose : '',
          reelDuration: detailsToUpdate?.reelDuration?.length > 0 ? detailsToUpdate.reelDuration : '',
          reelSampleLink: detailsToUpdate?.reelSampleLink?.length > 0 ? detailsToUpdate.reelSampleLink : '',
          dueDateSelected: detailsToUpdate?.dueDateSelected?.length > 0 ? detailsToUpdate.dueDateSelected : '',
          selectedLevelOption: detailsToUpdate?.selectedLevelOption?.length > 0 ? detailsToUpdate.selectedLevelOption : '',
          orderAudioURL: detailsToUpdate?.orderAudioURL?.length > 0 ? detailsToUpdate.orderAudioURL : '',
          statusValue: detailsToUpdate?.statusValue?.length > 0 ? detailsToUpdate.statusValue : '',
          snippetVideoURL: detailsToUpdate?.snippetVideoURL?.length > 0 ? detailsToUpdate.snippetVideoURL : ''
        },
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  getReelOrderById = (id) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/'+id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  sendForApproval = (item) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/rimis/'+item.id+'/updates/' + item.updateId + '/')
      .set(item)
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateVideoSnippetURL = (orderId, snippetVideoURL) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + orderId + '/')
      .update({snippetVideoURL})
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  createGloriReelOrder = (reel) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/orders/' + reel.id + '/')
      .set(
        {
          id: reel.id,
          emailAddress: reel.emailAddress,
          igname: reel.igname,
          firstName: reel.firstName,
          lastName: reel.lastName,
          reelPurpose: reel.reelPurpose,
          reelDuration: reel.reelDuration,
          reelSampleLink: reel.reelSampleLink,
          dueDateSelected: reel.dueDateSelected,
          selectedLevelOption: reel.selectedLevelOption,
          orderAudioURL: reel.orderAudioURL,
          statusValue: 0,
          snippetVideoURL: "",
        }
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }
}

export default new Firebase();
