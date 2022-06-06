import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import Context from '../context';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { CometChat } from '@cometchat-pro/react-native-chat';

const Home = (props) => {
  const { navigation } = props;
  console.log(props.route.params);
  const uidUser = props.route.params

  const { cometChat, setSelectedConversation } = useContext(Context);

  const [keyword, setKeyword] = useState('');
  // 0 is user, 1 is group.
  const [selectedType, setSelectedType] = useState(0);
  // data that will be shown on the list, data could be the list of users, or the list of groups.
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedType === 0) {
      searchUsers();
    } else {
      searchGroups();
    }
  }, [cometChat, selectedType, keyword]);

  const searchUsers = () => {
    if (cometChat) {
      const limit = 30;

      const usersRequestBuilder = new cometChat.UsersRequestBuilder().setLimit(limit);
      const usersRequest = keyword ? usersRequestBuilder.setSearchKeyword(keyword).build() : usersRequestBuilder.build();
      usersRequest.fetchNext().then(
        userList => {
          //user list hien thị
          setData(() => userList);
        },
        error => {
        }
      );
    }
  };

  const searchGroups = () => {
    const limit = 30;
    const groupRequestBuilder = new cometChat.GroupsRequestBuilder().setLimit(limit);
    const groupsRequest = keyword ? groupRequestBuilder.setSearchKeyword(keyword).build() : groupRequestBuilder.build();
    groupsRequest.fetchNext().then(
      groupList => {
       
        setData(() => groupList);
      },
      error => {
      }
    );
  };

  const onKeywordChanged = (keyword) => {
    setKeyword(() => keyword);
  };

  const updateSelectedType = (selectedType) => () => {
    setSelectedType(() => selectedType);
  };

  const joinGroup = (item) => {
    if (item && item.guid && !item.hasJoined) {
      const GUID = item.guid;
      const password = "";
      const groupType = cometChat.GROUP_TYPE.PUBLIC;

      cometChat.joinGroup(GUID, groupType, password).then(
        group => {
        },
        error => {
        }
      );
    }
  };

  const selectItem = (item) => () => {
    // join group  
    if (item && item.guid && !item.hasJoined) {
      joinGroup(item);
    }
    //
    setSelectedConversation({ ...item, contactType: selectedType });
    navigation.navigate('Chat');
  };

  const getKey = (item) => {
    
    if (item && item.uid) {
      return item.uid;
    }
    if (item && item.guid) {
      return item.guid;
    }
    return uuidv4();
  };


  const renderItems = ({ item }) => {

    return (
      <TouchableOpacity style={styles.listItem} onPress={selectItem(item)}>
        <Image
          style={styles.listItemImage}
          source={{
            uri: item.avatar ? item.avatar : item.icon
          }}
        />
        <Text style={styles.listItemLabel}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  // --------------------------------
  const [profile, setProfile] = useState(false);
  const [updateName, setUpdateName] = useState();
  const [updateAvatar, setUpdateAvatar] = useState();

  const onChangeUserName = (update) => {
    setUpdateName(() => update)
  }

  const onChangeUserAvatar = (update) => {
    setUpdateAvatar(() => update)
  }


  const [testU, setTestU]= useState();
  const [testT, setTestT] = useState(false);

  const handleUpdate = () => {
    
    console.log('update',updateName);
    console.log('first', props.route.params);
    let user = new CometChat.User(props.route.params);

    if(updateName && updateAvatar){
      user.setName(updateName);
      // user.setAvatar(updateAvatar);
      CometChat.updateCurrentUserDetails(user).then(
        user => {
            console.log("user updated", user);
        }, error => {
            console.log("error", error);
        }
    )
    }
    setTestT(true)
    console.log('testuuu',testU);
    console.log('testttt',testT);
  }
// ----------------
  const [userProfile, setUserProfile] = useState();
  
  useCallback(() => {
    CometChat.getUser(uidUser.userID).then(
      user => {
        setTestU(user)
        console.log("User details fetched for user:", user);
      }, error => {
        console.log("User details fetching failed with error:", error);
      }
    );
    console.log('testttt',testU);
  },[testT])
  const handleProfile= () => {
    if(uidUser){
      CometChat.getUser(uidUser.userID).then(
        user => {
          setUserProfile(user)
          console.log("User details fetched for user:", user);
        }, error => {
          console.log("User details fetching failed with error:", error);
        }
      );
    }
    setTestT(true)
    setProfile(true)
  }

  const handleBack = () => {
    setProfile(false);
  }
// 

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize='none'
          onChangeText={onKeywordChanged}
          placeholder="Search..."
          placeholderTextColor="#000"
          style={styles.input}
        />
      </View>
      <View style={styles.searchActionContainer}>
        <TouchableOpacity style={[styles.searchActionBtn, styles.searchLeftActionBtn, selectedType === 0 && styles.searchActionBtnActive]} onPress={updateSelectedType(0)}>
          <Text style={[styles.searchActionLabel, selectedType === 0 && styles.searchActionLabelActive]}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.searchActionBtn, styles.searchRightActionBtn, selectedType === 1 && styles.searchActionBtnActive]} onPress={updateSelectedType(1)}>
          <Text style={[styles.searchActionLabel, selectedType === 1 && styles.searchActionLabelActive]}>Group</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {/*  */}
        {!profile ? (
          <FlatList
          data={data}
          renderItem={renderItems}
          keyExtractor={(item, index) => getKey(item)}
        />
        ) : (
          <>
            {userProfile ? (
              <>
                <View style={styles.testT}>
                  <Image 
                    style={styles.imgProfile}
                    source={{
                      uri: userProfile.avatar ? userProfile.avatar : ""
                    }}
                  />
                  <View>
                    <Text>My Name</Text>
                    <Text style={styles.colorName}>{userProfile.name}</Text>
                  </View>
                </View>
              <TextInput 
              onChangeText={onChangeUserName}
              placeholder="Update username"
              placeholderTextColor="#000"
              style={styles.inputProfile}
              
              />
             
              <TextInput 
              onChangeText={onChangeUserAvatar}
              placeholder="Copy url to update avatar"
              placeholderTextColor="#000"
              style={styles.inputProfile}
              
              />
              <TouchableOpacity onPress={handleUpdate} style={styles.buttonProfile} >
                <Text >update</Text>
              </TouchableOpacity>
              </>
              ): (<></>)}
          </>
        )}
      </View>  
      
      <View >
        {!profile ? (
          <TouchableOpacity onPress={handleProfile}>
            <Text >Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleBack}>
            <Text >Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    borderColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginHorizontal: 8,
    padding: 12,
  },
  searchActionContainer: {
    borderRadius: 8,
    flexDirection: 'row',
    margin: 8,
  },
  searchActionBtn: {
    backgroundColor: '#fff',
    borderColor: '#000',
    flex: 1,
    fontSize: 16,
    padding: 8
  },
  searchLeftActionBtn: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 0,
  },
  searchRightActionBtn: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: 0,
  },
  searchActionBtnActive: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
    borderRadius: 8,
  },
  searchActionLabel: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  searchActionLabelActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  listItemImage: {
    width: 32,
    height: 32,
    marginRight: 8
  },
  listItemLabel: {
    fontSize: 16,
  },
  imgProfile: {
   width: 100,
  height:100,
  marginRight: 100
  },

  testT:{
    display:'flex',
    justifyContent: 'center',
    flexDirection:'row',
    alignItems:'center'
  },
  colorName:{
    color: 'blue',
    fontSize: 24
  },
  inputProfile: {
    borderColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    marginHorizontal: 8,
    padding: 12,
    marginBottom: 15,
    color:'brown'
  },
  buttonProfile:{
    backgroundColor:'brown',
    width: 100,
    padding: 10,
    marginLeft: 10,
    borderRadius: 8
  }
});

export default Home;