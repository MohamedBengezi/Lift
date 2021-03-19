import React, { useState, useContext, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import Testimonial from "../../components/Testimonial";
import colors from "../../hooks/colors";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, RefreshControl } from "react-native";
import { Context as AuthContext } from "../../context/AuthContext";

const ViewTestimonialScreen = ({ navigation }) => {
  let plan = navigation.getParam("plan");
  const { state, getTestimonials } = useContext(AuthContext);
  useEffect(() => {
    if (!state.testimonials) getTestimonials({ planid: plan.id });
  }, [navigation]);

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getTestimonials({ planid: plan.id });
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  function renderPlan(item) {
    if (!item) return null;
    return (
      <Testimonial reviewInfo={item.item} route={navigation.state.routeName} />
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: colors.white,
          height: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ height: "100%" }}
      >
        {state.testimonials ? (
          <View style={{ flex: 1, alignItems: "center" }}>
            <FlatList
              data={state.testimonials.replies}
              renderItem={(item) => renderPlan(item)}
              keyExtractor={(item) => item.id + ""}
              scrollEnabled={true}
              contentContainerStyle={{ marginTop: 5 }}
              style={{ width: "100%" }}
            />
          </View>
        ) : (
          <Text> No reviews yet! </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewTestimonialScreen;
