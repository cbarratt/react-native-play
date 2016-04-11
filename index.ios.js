import React, {
  AppRegistry,
  Component,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TabBarIOS,
} from 'react-native';

const API_URL = 'http://home.barratt.me:4000/api/v1/weighins';
const POSTCODE_API_URL = 'http://api.postcodes.io/postcodes';
const base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Welcome'
    };
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'Welcome'}
          title="Postcode"
          icon={{uri: base64Icon, scale: 3}}
          onPress={() => {
            this.setState({
              selectedTab: 'Welcome',
            });
          }}>
          <Welcome/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'Health'}
          title="Health"
          icon={{uri: base64Icon, scale: 3}}
          onPress={() => {
            this.setState({
              selectedTab: 'Health',
            });
          }}>
          <Health/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      postcode: '',
      data: ''
    }
  }

  _submitForm = () => {
    const postcode  = this.state.postcode
    console.log(postcode)

    fetch(`${POSTCODE_API_URL}/${postcode}`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({data: responseData.result});
      })
      .done();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.weightContainer}>
          <TextInput
            autoCapitalize="characters"
            style={styles.textEdit}
            value={this.state.postcode}
            onChangeText={postcode => this.setState({postcode})}
            placeholder="Postcode"
            onSubmitEditing={this._submitForm}
          />

          <Text style={styles.postcodeData}>{this.state.data.parish}</Text>
          <Text style={styles.postcodeData}>{this.state.data.nuts}</Text>
          <Text style={styles.postcodeData}>{this.state.data.nhs_ha}</Text>
        </View>
      </View>
    );
  }
}

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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#F5FCFF',
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

AppRegistry.registerComponent('health', () => App);
