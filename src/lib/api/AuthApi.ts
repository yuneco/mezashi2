import firebase from './firebase'

/**
 * Get current user.
 * If login process is in progress, this api wait until it is done.
 */
const getUser = async () => {
  return new Promise<firebase.User | null>(resolve => {
    const observer = firebase.auth().onAuthStateChanged(async user => {
      // console.log('onAuthStateChanged', user)
      observer()
      resolve(user)
    })
  })
}

/**
 * Login anonimouse if the user not logged in.
 * If user already logged in (includes logged in other method like Google login), this api just return current credential.
 */
const loginAnonimouse = async () => {
  const crUser = await getUser()
  if (crUser) {
    return crUser
  }
  const anonCredential = await firebase.auth().signInAnonymously()
  return anonCredential.user
}

const loginWithGoogle = async () => {
  const crUser = await getUser()
  if (!crUser || !crUser.isAnonymous) {
    return null
  }
  const provider = new firebase.auth.GoogleAuthProvider()
  return crUser.linkWithRedirect(provider)
}

const linkWithTwitter = async () => {
  const crUser = await getUser()
  if (!crUser || !crUser.isAnonymous) {
    return null
  }
  const provider = new firebase.auth.TwitterAuthProvider()
  return crUser.linkWithRedirect(provider)
}

const logoutThenLoginWithTwitter = async () => {
  await firebase.auth().signOut()
  const provider = new firebase.auth.TwitterAuthProvider()
  return firebase.auth().signInWithRedirect(provider)
}

export default {
  loginAnonimouse,
  getUser,
  linkWithTwitter,
  loginWithGoogle,
  logoutThenLoginWithTwitter,
  get uid () {
    const user = firebase.auth().currentUser
    return user ? user.uid : null
  },
  get twUid () {
    const user = firebase.auth().currentUser
    if (!user || user.isAnonymous || !user.providerData || !user.providerData[0]) { return null }
    return (user.providerData[0]).uid
  },
  get twName () {
    const user = firebase.auth().currentUser
    if (!user || user.isAnonymous || !user.providerData || !user.providerData[0]) { return null }
    return (user.providerData[0]).displayName
  }
}
