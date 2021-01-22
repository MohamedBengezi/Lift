import React, { Component, useContext } from 'react'
import {
    Animated,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    LogBox,
    StatusBar
} from 'react-native'
import { Icon } from 'react-native-elements'
import {
    TabView,
    TabBar,
    TabViewPagerScroll,
    TabViewPagerPan,
} from 'react-native-tab-view'
import PropTypes from 'prop-types'
import Ionicons from "react-native-vector-icons/Ionicons";
import Posts from './helpers/Posts'
import { navigate } from '../navigationRef'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Feed from '../components/Feed'
import serverApi from "../api/server";
import colors from '../hooks/colors'
import { Context as PostsContext } from '../context/AuthContext';

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        backgroundColor: colors.white,
        marginBottom: 10,
        marginTop: 15,
    },
    indicatorTab: {
        backgroundColor: 'transparent',
    },
    scroll: {
        backgroundColor: colors.white,
    },
    sceneContainer: {
        marginTop: 10,
    },
    socialIcon: {
        marginLeft: 14,
        marginRight: 14,
    },
    socialRow: {
        flexDirection: 'row',
    },
    tabBar: {
        backgroundColor: colors.lightGrey,
    },
    tabContainer: {
        flex: 1,
        marginBottom: 12,
    },
    tabLabelNumber: {
        color: colors.grey,
        fontSize: 12.5,
        textAlign: 'center',
    },
    tabLabelText: {
        color: colors.black,
        fontSize: 22.5,
        fontWeight: '600',
        textAlign: 'center',
    },
    userBioRow: {
        marginLeft: 40,
        marginRight: 40,
    },
    userBioText: {
        color: colors.darkerGrey,
        fontSize: 13.5,
        textAlign: 'center',
    },
    userImage: {
        borderRadius: 60,
        height: 120,
        marginBottom: 10,
        width: 120,
    },
    userNameRow: {
        marginBottom: 10,
    },
    userNameText: {
        color: colors.reallyDarkGrey,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userRow: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 12,
    },
    settings: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 15,
        marginTop: StatusBar.currentHeight
    }
});

class Profile extends Component {

    static propTypes = {
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        tabContainerStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        posts: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                words: PropTypes.string.isRequired,
                sentence: PropTypes.string.isRequired,
                paragraph: PropTypes.string.isRequired,
                image: PropTypes.string,
                user: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    username: PropTypes.string.isRequired,
                    avatar: PropTypes.string.isRequired,
                    email: PropTypes.string.isRequired,
                }),
            })
        ).isRequired,
    }

    userPosts = [];

    static defaultProps = {
        containerStyle: {},
        tabContainerStyle: {},
    }

    state = {
        tabs: {
            index: 0,
            routes: [
                { key: '1', title: 'likes', count: 86 },
                { key: '2', title: 'following', count: 95 },
                { key: '3', title: 'followers', count: '1.3 K' },
            ],
        },
    }

    componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
        LogBox.ignoreLogs(['Setting a timer'])
        let { state, getUserPost } = this.context;
        getUserPost();
        this.userPosts = state.posts
    }

    handleIndexChange = index => {
        this.setState({
            tabs: {
                ...this.state.tabs,
                index,
            },
        })
    }

    renderTabBar = props => {
        return <TabBar
            indicatorStyle={styles.indicatorTab}
            renderLabel={this.renderLabel(props)}
            pressOpacity={0.8}
            style={styles.tabBar}
            {...props}
        />
    };

    renderLabel = props => ({ route }) => {
        const routes = props.navigationState.routes

        let labels = []
        routes.forEach((e, index) => {
            labels.push(index === props.navigationState.index ? 'black' : 'gray')
        })

        const currentIndex = parseInt(route.key) - 1
        const color = labels[currentIndex]

        return (
            <View>
                <Animated.Text style={[styles.tabLabelText, { color }]}>
                    {route.count}
                </Animated.Text>
                <Animated.Text style={[styles.tabLabelNumber, { color }]}>
                    {route.title}
                </Animated.Text>
            </View>
        )
    }

    renderScene = ({ route: { key } }) => {
        const { posts } = this.props

        const apiLink = serverApi.defaults.baseURL;
        let url = apiLink + "/sample";

        switch (key) {
            case '1':
                return <Feed img={this.props.avatar} url={url} title="Example post" />
            case '2':
                return <Posts containerStyle={styles.sceneContainer} posts={posts} />
            case '3':
                return <Posts containerStyle={styles.sceneContainer} posts={posts} />
            case '4':
                return <Posts containerStyle={styles.sceneContainer} posts={posts} />
            default:
                return <View />
        }
    }

    renderContactHeader = () => {
        const { avatar, name, bio } = this.props;
        return (
            <View style={styles.headerContainer}>
                <View style={styles.userRow}>
                    <Image
                        style={styles.userImage}
                        source={{ uri: avatar }}
                    />
                    <View style={styles.userNameRow}>
                        <Text style={styles.userNameText}>{name}</Text>
                    </View>
                    <View style={styles.userBioRow}>
                        <Text style={styles.userBioText}>{bio}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        console.log('List of user posts: ', this.userPosts);

        return (
            <ScrollView style={styles.scroll}>
                <View style={[styles.container, this.props.containerStyle]}>
                    <View style={styles.cardContainer}>
                        <TouchableOpacity style={styles.settings} onPress={() => navigate('Settings')}>
                            <Ionicons
                                name="md-settings"
                                color='#505050'
                                type="ionicon" size={35}
                            />

                        </TouchableOpacity>
                        {this.renderContactHeader()}
                        <TabView
                            style={[styles.tabContainer, this.props.tabContainerStyle]}
                            navigationState={this.state.tabs}
                            renderScene={this.renderScene}
                            renderTabBar={this.renderTabBar}
                            onIndexChange={this.handleIndexChange}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

Profile.contextType = PostsContext;
export default Profile