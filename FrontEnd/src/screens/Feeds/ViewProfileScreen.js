import React, { useContext, useState, useEffect } from 'react'
import {
    Animated,
    Image,
    Platform,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    StyleSheet,
    Text,
    View,
    LogBox,
    StatusBar
} from 'react-native'
import {
    TabView,
    TabBar,
} from 'react-native-tab-view'
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from '../../navigationRef'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Feed from '../../components/Feed'
import colors from '../../hooks/colors'
import { Context as PostsContext } from '../../context/AuthContext';
import { firebaseApp, functions } from "../../../firebase";
import { Button } from "react-native-elements";

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const ViewProfile = (props) => {
    const { state, getUserPost } = useContext(PostsContext);
    const [propTypes, setPropTypes] = useState({ ...props });
    
  //  const [userInfo, setUserInfo] = useState(propTypes.userInfo.data);
  const userInfo = state.otherUserInfo;
    const [posts, setPosts] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [tabs, setTabs] = useState({
        index: 0,
        routes: [
            { key: '1', title: 'posts', count: 0 },
            { key: '2', title: 'following', count: userInfo ? userInfo.following :0  },
            { key: '3', title: 'followers', count: userInfo ? userInfo.followers :0 },
        ],
    })
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUserPost(setPosts);
        wait(2000).then(() => {
            setRefreshing(false);
        });
    }, []);
    useEffect(() => {
        setIsFollowing(true)
        getUserPost(setPosts)
        LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
        LogBox.ignoreLogs(['Setting a timer'])

    }, []);

    const handleIndexChange = index => {
        setTabs({
            ...tabs,
            index,
        })
    }

    const renderTabBar = props => {
        return <TabBar
            indicatorStyle={styles.indicatorTab}
            renderLabel={renderLabel(props)}
            pressOpacity={0.8}
            style={styles.tabBar}
            {...props}
        />
    };

    const renderLabel = props => ({ route }) => {
        const routes = props.navigationState.routes

        let labels = []
        routes.forEach((e, index) => {
            labels.push(index === props.navigationState.index ? 'black' : 'gray')
        })

        const currentIndex = parseInt(route.key) - 1
        const color = labels[currentIndex]

        currentIndex === 0 ? route.count = posts ? posts.length : 0 : null;

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

    const renderScene = ({ route: { key } }) => {

        switch (key) {
            case '1':
                return posts ? (
                    <Feed posts={posts} />
                ) : null
            default:
                return <View />
        }
    }

    const renderContactHeader = () => {
        const { avatar, name, bio } = propTypes;
        return (
            <View style={styles.headerContainer}>
                <View style={styles.userRow}>
                    <Image
                        style={styles.userImage}
                        source={{ uri: state.otherProfilePicture ? state.otherProfilePicture : avatar }}
                    />
                    <View style={styles.userNameRow}>
                        <Text style={styles.userNameText}>{name}</Text>
                    </View>
                    <View style={styles.userBioRow}>
                        <Text style={styles.userBioText}>{userInfo ? userInfo.bio : ""}</Text>
                    </View>
                </View>
            </View>
        )
    }

    function FollowButton() {
        return (
            <Button
                title={isFollowing ? "Unfollow" : "Follow"}
                onPress={() => {
                    setIsFollowing(!isFollowing);
                }}
                buttonStyle={isFollowing ? styles.button : { ...styles.button, backgroundColor: colors.blue }}
                titleStyle={styles.buttonText}
                containerStyle={styles.containerStyle}
            />
        );
    }
    return (
        <SafeAreaView>
            <ScrollView style={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={[styles.container]}>
                    <View style={styles.cardContainer}>
                        {renderContactHeader()}
                        <FollowButton />
                        <TabView
                            style={[styles.tabContainer]}
                            navigationState={tabs}
                            renderScene={renderScene}
                            renderTabBar={renderTabBar}
                            onIndexChange={handleIndexChange}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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
    },
    button: {
        backgroundColor: colors.yellow,
        width: "30%",
        borderRadius: 5,
    },
    containerStyle: {
        alignItems: "center",
        marginBottom: "5%",
        flex: 0.15,
    },
    buttonText: {
        color: colors.black,
        flex: 1,
        fontSize: 15,
    },
});
export default ViewProfile;