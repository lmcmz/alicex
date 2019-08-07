import React, {Component} from "react";
import {Text, ScrollView, TouchableOpacity, StyleSheet, View, Dimensions, Image} from "react-native";
import moment from 'moment';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {NavigationBar} from "../../../AliceComponents/NavigationBar";
import Countdown from '../Components/Countdown'
import Icon from "../../../AliceComponents/IconComponent";

const { height, width } = Dimensions.get('window');

const PROPOSALS_QUERY = gql`
      query Proposal($id: ID!) {
        dao(id: $id) {
          id
          name
          reputationHoldersCount
          proposals(orderBy:createdAt) {
            id  
            stage
            proposer
            createdAt
            preBoostedAt
            closingAt
            title
            votes {
              id
              voter
            }
            votesFor
            votesAgainst
            url
          } 
        }
    }`;

export default class DAOstackApp extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      tabBarIcon: ({tintColor}) => <Icon icon={require('../Assets/home.png')} size={20}/>,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      daos: []
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <Query query={PROPOSALS_QUERY} variables={{ id: this.props.navigation.state.params.dao.id }}>
          {({ loading, error, data }) => {
            if (error) return <Text>Can't fetch Proposals</Text>;
            if (loading) return <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
              <Text style={{fontSize: 30, fontFamily: 'Didot'}}>Loading ...</Text>
            </View>
            return (
              <>
                <ScrollView>
                  <View style={styles.container}>
                    {data.dao.proposals.map((proposal, i) => {
                      i === 0 && console.log(moment(proposal.closingAt));
                      return (
                        <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('DAOstackHome', {dao})} style={styles.daoBox}>
                          <View style={{width: '100%', padding: 10, borderTopLeftRadius: 15, borderTopRightRadius: 15,}}>
                            <Countdown timeTillDate={proposal.closingAt}/>
                            <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>{proposal.closingAt}</Text>
                            <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>{proposal.proposer}</Text>
                          </View>
                          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <View style={{alignItems: 'center', justifyContent: 'space-around', margin: 17}}>
                              <Text style={{color: 'grey', fontSize: 10, marginBottom: 15, fontWeight: '700'}}>Reputation Holders</Text>
                              <Text style={{fontSize: 25, fontWeight: '700'}}>{proposal.closingAt}</Text>
                            </View>
                            <View style={{height: 50, width: 1, backgroundColor: '#c9c9c9'}}/>
                            <View style={{alignItems: 'center', justifyContent: 'space-around', margin: 17}}>
                              <Text style={{color: 'grey', fontSize: 10, marginBottom: 15, fontWeight: '700'}}>Open Proposals</Text>
                              <Text style={{fontSize: 25, fontWeight: '700'}}>{proposal.stage}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                    }
                  </View>
                </ScrollView>
              </>
            );
          }}
        </Query>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  daoBox: {
    width: width - 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,

  }
});