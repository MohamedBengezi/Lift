import React from 'react'
import PropTypes from 'prop-types'

import contactData from '../../mocks/contact.json';

import Profile from './ProfileScreen'

const ProfileScreen = () => <Profile {...contactData} />

ProfileScreen.navigationOptions = () => ({
    headerShown: false
})

ProfileScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
}

export default ProfileScreen