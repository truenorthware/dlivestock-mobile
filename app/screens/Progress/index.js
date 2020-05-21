import React from 'react'

import { StatusBar, Preloader } from 'components/blocks'

import { Container } from './styles'

const Progress = () => (
  <Container>
    <StatusBar barStyle="dark-content" translucent />
    <Preloader />
  </Container>
)

export default Progress
