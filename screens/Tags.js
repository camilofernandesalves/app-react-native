import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { 
  tagsChanged,
  tagsLoad,
  changeStep
} from '../redux/actions';

import { Navigation } from "react-native-navigation";
import Placeholder from 'rn-placeholder';


class Tags extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: "Tagging a Product",
          fontFamily: 'System San Francisco Display Regular'
        },
        leftButtons: [{
          id: "back",
          icon: require('../assets/back.png'),
          iconSize: 30
        }],
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      fieldSearch: null,
      isFetching: false,
      list: this.props.tags
    }
    Navigation.events().bindComponent(this); 
  }

  onRefresh() {
    this.setState({ isFetching: false }, function() { this.setState({list: this.props.tags}) });
  }

  componentDidMount() {
    this.props.tagsLoad();
  }

  navigationButtonPressed({ buttonId }) {
    if(buttonId === 'back') {
      this.props.changeStep(2);
      Navigation.push(this.props.componentId, {
        component: {
          name: 'redesocial.newPost'
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    const oldProps = this.props
    if(oldProps.tags !== newProps.tags) {
      this.onRefresh();
    }
  }

  addItem(text) {
    this.props.tagsChanged(text, this.props.tagsSelect);
  }

  renderListTags() {
    if(this.props.tags.length > 0) {
      return (
        <FlatList
          data={this.state.list}
          onRefresh={() => this.setState({list: this.props.tags})}
          refreshing={this.state.isFetching}
          renderItem={({item}) => {
            if(
              this.props.tagsSelect.indexOf(item.name) === -1 &&
              (this.state.fieldSearch === null ||
              item.name.search(this.state.fieldSearch) > -1 ||
              item.Editora.search(this.state.fieldSearch)  > -1)
            ){
              return (
                <TouchableOpacity onPress={() => this.addItem(item.name)}>
                  <View style={styles.line}>
                    <Text style={styles.fieldText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>)
            }
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }else{
      return (
        <View>
          {
            [1,2,3,4].map(({value, index}) => {
              return (
                <View style={[styles.line, {padding: 15}]}>
                    <Placeholder.Paragraph
                    lineNumber={3}
                    animate="fade"
                    lineNumber={4}
                    lineSpacing={5}
                    lastLineWidth="30%"
                    onReady={this.state.isReady}
                    keyExtractor={(value, index) => index.toString()}
                  />
                </View>
              )
            })
          }
          
        </View>
        
      );
    }
  };

  render() {
    return (
			<View>
        <View style={styles.line}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              this.setState({fieldSearch: text});
              return this.onRefresh();
            }}
            value={this.state.fieldSearch}
            placeholder='Type your tag'
          />
        </View>
      
        {this.renderListTags()}
      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 5,
    fontSize: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 5
  },
  fieldText: {
    padding: 30,
    fontSize: 20,
    fontFamily: 'System San Francisco Display Regular'
  },
  line: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  }
});

const mapStateToProps = state => {
  return {
    tags: state.fields.tags,
    tagsSelect: state.fields.tagsSelect
  }
};

export default connect(mapStateToProps, { 
  tagsChanged,
  tagsLoad,
  changeStep
})(Tags);