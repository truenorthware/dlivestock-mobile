import React, { Component } from 'react'
import PT from 'prop-types'
import { NavigationActions } from 'react-navigation'

import { menu } from 'constants/routeNames'

import { ReactNavigationPropTypes } from 'constants/propTypes'
import { UserTypes } from 'services/dataTypes'

import {
  Container,
  MenuContainer,
  FullName,
  Email,
  Footer,
  Touchable,
  ActiveMenuItem,
  InActiveMenuItem,
  MenuTitle,
  Button,
} from './styles'

class Drawer extends Component {
  getMenuContent = userType => {
    const menuOptions = [
      { key: '#menu-item1', title: 'Profile', routeName: menu.profile },
      { key: '#menu-item0', title: 'Trip', routeName: menu.trip },
    ]
    if (userType === UserTypes.Processor) {
      menuOptions.push({
        key: '#menu-item2',
        title: 'Trip Dashboard',
        routeName: menu.tripDashboard,
      })
    }
    return menuOptions
  }

  handleMenuItem = item => () => {
    const { navigation } = this.props
    navigation.dispatch(NavigationActions.navigate({ routeName: item.routeName }))
  }

  render() {
    const { activeItemKey, handleLogOut, user } = this.props
    const { firstName, lastName, email } = user
    return (
      <Container>
        <MenuContainer>
          <FullName>
            {firstName} {lastName}
          </FullName>
          <Email>{email}</Email>
          {this.getMenuContent(user.type).map(item => {
            return (
              <Touchable key={item.key} onPress={this.handleMenuItem(item)}>
                {item.routeName === activeItemKey ? (
                  <ActiveMenuItem>
                    <MenuTitle>{item.title}</MenuTitle>
                  </ActiveMenuItem>
                ) : (
                  <InActiveMenuItem>
                    <MenuTitle>{item.title}</MenuTitle>
                  </InActiveMenuItem>
                )}
              </Touchable>
            )
          })}
        </MenuContainer>

        <Footer>
          <Button title="LOGOUT" onPress={handleLogOut} variant="quarter" />
        </Footer>
      </Container>
    )
  }
}

Drawer.propTypes = {
  ...ReactNavigationPropTypes,
  handleLogOut: PT.func.isRequired,
}

export default Drawer
