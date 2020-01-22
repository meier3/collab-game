import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';

class GridSquare extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    switch (this.props.type) {
      case "0":
        return (
          <View style={styles.square}>

          </View>
        )
      case "1":
        return (
          <View style={styles.square}>
            <Image style={styles.gridImage} resizeMode='contain' source = {require("./assets/Obstacle.png")} />
          </View>
        )
      case "2":
        return (
          <View style={styles.square}>
            <Image style={styles.gridImage} resizeMode='contain' source = {require("./assets/FrogMan.png")} />
          </View>
        )
      case "3":
        return (
          <View style={styles.square}>
            <Image style={styles.gridImage} resizeMode='contain' source = {require("./assets/End.png")} />
          </View>
        )
    }
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      grid: [[2, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 3]],
      player_num : 1,
      waiting : false
    }
  }

  leftPress = () => {
    let newGrid = [[1, 0, 3, 0],
    [1, 1, 3, 0],
    [1, 3, 3, 0],
    [1, 1, 1, 3]];
    
    this.setState(() => (
      { grid: newGrid }
    ))
    // console.log('pressed');
  };

  // middlePress = () => {
  //   console.log(this.counter);
  // };

  // rightPress = () => {
  //   console.log(this.counter);
  // };

  x = <Text>Hello World</Text>;

  renderGrid() {
    let output = [];
    let grid = this.state.grid

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];

      let content = [];
      for (let j = 0; j < row.length; j++) {
        const squareVal = row[j];

        // 0 = empty, 1 = obstacle, 2 = sprite, 3 = final

        switch (squareVal) {
          case 0:
            // empty
            content.push(<GridSquare type="0" />);
            break;
          case 1:
            // obstacle
            content.push(<GridSquare type="1" />);
            break;
          case 2:
            // sprite
            content.push(<GridSquare type="2" />);
            break;
          case 3:
            // finish
            content.push(<GridSquare type="3" />);
            break;
        }
      }

      output.push(<View style={styles.row}>{content}</View>);
    }

    return output;

    // let y = [this.x]
    // let a = <Text>Testing...</Text>;
    // y.push(<View>{a}</View>);
    // return y;

    // let y = [this.x];
    // y.push(<Text>);
    // y.push(Another one!);
    // y.push(</Text>);
    // return y;
  }


  button_left = function(options) {
    if(this.state.player_num == 1){
      return {
        transform: [{ rotate: '180deg'}],
        flex:1,
      }
    }
    else {
      return {
        transform: [{ rotate: '90deg'}],
        flex:1,
      }
    }
  }
  button_right = function(options) {
    if(this.state.player_num == 1){
      return {
        flex:1,
      }
    }
    else {
      return {
        transform: [{ rotate: '270deg'}],
        flex:1,
      }
    }
  }

  opacity = function(options) {
    if(this.state.waiting) {
      return {
        opacity: .3,
        flex:1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
      }
    }
    else {
      return {
        flex:1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
        }
      }
    }

  popupBox = function(options) {
    if(this.state.waiting){
      return {
        opacity: 1,
        zIndex: 10,
        position: "absolute",
        height: "30%",
        width: "30%",
        alignSelf: "center",
        backgroundColor: "green"
      }
    }
    else {
      return {
        opacity: 0,
      }
    }
  }

  render() {

    var player = 1;
    var gridsize = 3;

    return (

      <View style={styles.body}>
        <View style = {this.popupBox()}>
          <Text> Waiting for other player. (Switch with waiting image later) </Text>
        </View>

        <View style={styles.gameview}>
          {this.renderGrid()}
        </View>

        <View style={styles.controls}>
          <TouchableHighlight style={styles.button} onPress={this.leftPress}>
            <View  style = {this.opacity()}>
              <Image style= {this.button_left()} resizeMode='contain' source = {require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.middlePress}>
            <View  style = {this.opacity()}>
              <Image style= {styles.skip} resizeMode='contain' source = {require("./assets/button.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.rightPress}>
            <View  style = {this.opacity()}>
              <Image style= {this.button_right()} resizeMode='contain' source = {require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

App.defaultProps = {
  counter: 0,
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameview: {
    flex: 4,
    alignSelf: 'stretch',
    borderColor: 'red',
    borderWidth: 2,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderColor: 'blue',
    borderWidth: 2,
  },
  button: {
    flex: 1,
    backgroundColor: 'gray',

  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
  },
  square: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2,
  },
  gridImage: {
    backgroundColor: "white",
    flex:1
  },
  skip: {
    flex: 1,
  },
});

export default App;
