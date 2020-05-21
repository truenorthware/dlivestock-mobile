import Secrets from 'react-native-config'
import VersionNumber from 'react-native-version-number'

import { name as bundleName } from '../../app.json'

export default {
  bundleName,
  dev: Secrets.IS_DEV === 'true',
  name: Secrets.APPLICATION_NAME,
  version: VersionNumber.appVersion,
  buildVersion: VersionNumber.buildVersion,
  bundleIdentifier: VersionNumber.bundleIdentifier,
  appearance: { theme: 'main' },
  allowTextFontScaling: false,
}
