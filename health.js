import React, {
  Component,
  ListView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const API_URL = 'http://home.barratt.me:4000/api/v1/weighins';

class Health extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.weighins),
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader}
        renderRow={this.renderWeighin}
        style={styles.listView}
        contentInset={{bottom:49}}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading data...
        </Text>
      </View>
    );
  }

  renderHeader() {
    return (
      <View>
        <Text style={styles.head}>Health</Text>
      </View>
    )
  }

  renderWeighin(weighin) {
    return (
      <View style={styles.container}>
        <View style={styles.weightContainer}>
          <Text style={styles.title}>{weighin.weight} KG</Text>
          <Text style={styles.title}>{weighin.bodyfat_percentage}% Bodyfat</Text>
          <Text style={styles.title}>{weighin.taken_at}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  head: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  weightContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  listView: {
    paddingTop: 20,
  },
  textEdit: {
    padding: 5,
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  postcodeData: {
    padding: 10,
  },
});

module.exports = Health;
