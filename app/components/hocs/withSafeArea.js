import React from 'react'

import { SafeAreaView } from 'react-navigation'

const Nullable = () => null

const withSafeArea = () => (WrappedComponent = Nullable) => {
  const SafeArea = props => (
    <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={{ flex: 1 }}>
      <WrappedComponent {...props} />
    </SafeAreaView>
  )

  return SafeArea
}

export { withSafeArea }
