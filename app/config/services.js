import Secrets from 'react-native-config'

const webProtocol = Secrets.IS_DEV === 'true' ? 'http' : 'https'
const webSocketsProtocol = Secrets.IS_DEV === 'true' ? 'ws' : 'wss'

const api = {
  webUrl: `${webProtocol}://${Secrets.API_URL}`,
  webSocketsUrl: `${webSocketsProtocol}://${Secrets.API_URL}`,
}

export default {
  api,
}
