import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';

const _grid = [
  [
    [1, 0, 3, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 0]],
  [
    [0, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 0, 3]
  ],
  [
    [0, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 0, 1],
    [3, 1, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 3, 1, 0]
  ],
  [
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 3]
  ],
  [
    [0, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 3]
  ]
]

class GridSquare extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var img;
    switch (this.props.type) {
      // Sets the visuals in each grid box based on the value at the given matrix index
      case 0:
        break;
      case 1:
        img = require("./assets/Obstacle.png");
        break;
      case 2:
        img = require("./assets/FrogMan.png");
        break;
      case 3:
        img = require("./assets/End.png");
        break;
    }
    return (
      <View style={styles.square}>
        <Image style={styles.gridImage} resizeMode='contain' source={img} />
      </View>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      player_num: 1,
      waiting: false,
      victory: false,
      grid_list: this.props.mainGridList,
      grid: this.props.mainGrid,
      spritePos: this.props.startPos,
      current_grid_number: 0,
    };
    // Building of connection to server
    this.ws = new WebSocket('ws://localhost:8080');
  }

  componentDidMount() {

    this.ws.bufferType = "arraybuffer";
    //runs whenever message recieved from server
    this.ws.onmessage = (direction) => {
      // sets player number for beginning of game
      if (direction.data == "player1") {
        this.setState({ player_num: 1 })
      }
      else if (direction.data == "player2") {
        this.setState({ player_num: 2 })
      }
      else {
        // Use directions given from server to update grid visuals.
        this.setState({ waiting: false })
        var reader = new FileReader();
        var x = reader.readAsText(direction.data);
        console.log("\ndata: ", x)
        
        this.move(direction.data);
      }
    };
    this.updateGrid();
  }

  isValidMove(pos) {
    console.log(pos)
    let r = pos[0], c = pos[1];
    let gridW = this.state.grid[0].length - 1;
    let gridH = this.state.grid.length - 1;

    console.log('r: %s, c: %s, gridW: %s, gridH: %s', r, c, gridW, gridW)

    // check out-of-bounds
    if ((r < 0) || (c < 0) || (r > gridH) || (c > gridW)) {
      console.log("out of bounds!")
      return false;
    }
    // check obstacles
    else if (this.state.grid[r][c] == 1) {
      console.log("obstacle!")
      return false;
    }
    else {
      console.log("valid move!")
      return true;
    }
  }

  leftPress = () => {
    console.log("pressed")
    if (this.state.waiting || this.state.victory) {
      return;
    }
    // setTimeout(() => {
    this.ws.send([this.state.player_num, -1]);
    // }, 100);
    this.setState({ waiting: true });
  };

  middlePress = () => {
    if (this.state.waiting || this.state.victory) {
      return;
    }
    this.ws.send([this.state.player_num, 0]);
    this.setState({ waiting: true });
  };

  rightPress = () => {
    if (this.state.waiting || this.state.victory) {
      return;
    }
    this.ws.send([this.state.player_num, 1]);
    this.setState({ waiting: true });

  };

  move(delta) {
    let pos = this.state.spritePos;
    let newPos = [pos[0] + delta[0], pos[1] + delta[1]];
    console.log('pos: ', pos)
    console.log('delta: ', delta)

    if (this.isValidMove(newPos)) {
      this.updateSprite(newPos);
    }
  }

  nextLevelPress = () => {
    if (this.state.victory) {
      this.setState({ victory: false });
      //this.setState({grid : this.props.anotherGrid});
      let newVal = this.state.current_grid_number + 1;
      if (newVal > _grid.length - 1) {
        newVal = 0;
      }
      this.setState({ current_grid_number: newVal });
      this.setState({ spritePos: this.props.startPos });
      if (this.state.player_num == 1) {
        this.setState({ player_num: 2 })
      }
      else {
        this.setState({ player_num: 1 })
      }
      setTimeout(() => {
        this.updateGrid();
      }, 0);

    }
  };

  updateSprite(pos) {
    this.setState({ spritePos: pos });
    // setState is async, this timeout lets it finish before rendering
    setTimeout(() => {
      this.updateGrid();
    }, 0);
  };

  updateGrid() {
    // deep copy blank grid
    let newGrid = JSON.parse(JSON.stringify(_grid[this.state.current_grid_number]));
    // add sprite
    let pos = this.state.spritePos;
    newGrid[pos[0]][pos[1]] = 2;
    // update the grid
    if (_grid[this.state.current_grid_number][pos[0]][pos[1]] == 3) {
      this.setState({ victory: true })
    }
    this.setState({ grid: newGrid });
    this.render()
  };

  renderGrid() {
    let output = [];
    let grid = this.state.grid;
    let squareCounter = 0;
    let rowCounter = 0;

    // iterate through grid data, create GridSquares accordingly
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      let content = [];

      for (let j = 0; j < row.length; j++) {
        const squareVal = row[j];
        // add new GridSquare to row
        content.push(<GridSquare type={squareVal} key={squareCounter} />);
        squareCounter++;
      }
      // add row to output
      output.push(<View style={styles.row} key={rowCounter}>{content}</View>);
      rowCounter++;
    }

    return output;
  }

  button_left = function (options) {
    if (this.state.player_num == 1) {
      return {
        transform: [{ rotate: '180deg' }],
        flex: 1,
      }
    }
    else {
      return {
        transform: [{ rotate: '270deg' }],
        flex: 1,
      }
    }
  }

  button_right = function (options) {
    if (this.state.player_num == 1) {
      return {
        flex: 1,
      }
    }
    else {
      return {
        transform: [{ rotate: '90deg' }],
        flex: 1,
      }
    }
  }

  opacity = function (options) {
    if (this.state.waiting) {
      return {
        opacity: .3,
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: "pink"
      }
    }
    else {
      return {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: "pink"
      }
    }
  }

  popupVictory = function (options) {
    if (this.state.victory) {
      return {
        opacity: 1,
        zIndex: 10,
        position: "absolute",
        height: "50%",
        width: "50%",
        alignSelf: "center",
      }
    }
    else {
      return {
        opacity: 0,
        zIndex: 10,
        position: "absolute",
        height: "50%",
        width: "50%",
        alignSelf: "center",
      }
    }
  }

  popupBox = function (options) {
    if (this.state.waiting) {
      return {
        opacity: 1,
        zIndex: 10,
        position: "absolute",
        height: "50%",
        width: "50%",
        alignSelf: "center",
      }
    }
    else {
      return {
        opacity: 0,
        zIndex: 10,
        position: "absolute",
        height: "50%",
        width: "50%",
        alignSelf: "center",
      }
    }
  }

  render() {
    return (

      <View style={styles.body}>
        <View style={this.popupBox()}>
          <Image style={styles.skip} resizeMode='contain' source={require("./assets/wait.png")} />
        </View>
        <TouchableHighlight style={this.popupVictory()} onPress={this.nextLevelPress}>
          <View style={styles.skip}>
            <Image style={styles.skip} resizeMode='contain' source={require("./assets/congrats.png")} />
          </View>
        </TouchableHighlight>
        <View style={styles.gameview}>
          {this.renderGrid()}
        </View>

        <View style={styles.controls}>
          <TouchableHighlight style={this.opacity()} onPress={this.leftPress}>
            <View style={this.opacity()}>
              <Image style={this.button_left()} resizeMode='contain' source={require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={this.opacity()} onPress={this.middlePress}>
            <View style={this.opacity()}>
              <Image style={styles.skip} resizeMode='contain' source={require("./assets/button.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={this.opacity()} onPress={this.rightPress}>
            <View style={this.opacity()}>
              <Image style={this.button_right()} resizeMode='contain' source={require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

App.defaultProps = {
  // 0 = empty, 1 = obstacle, 2 = sprite, 3 = final
  mainGrid: _grid[0],
  mainGridList: _grid,
  startPos: [0, 1],
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
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    backgroundColor: 'gray',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2,
  },
  gridImage: {
    backgroundColor: "white",
    flex: 1
  },
  skip: {
    flex: 1,
  },
});

export default App;
