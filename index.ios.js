import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TabBarIOS,
} from 'react-native';

import Health from './health';

const POSTCODE_API_URL = 'http://api.postcodes.io/postcodes';
const FAKE_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

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
          icon={{uri: FAKE_ICON, scale: 3}}
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
          icon={{uri: FAKE_ICON, scale: 3}}
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

  submitForm = () => {
    const postcode = this.state.postcode

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
            onSubmitEditing={this.submitForm}
          />

          <Text style={styles.postcodeData}>{this.state.data.parish}</Text>
          <Text style={styles.postcodeData}>{this.state.data.nuts}</Text>
          <Text style={styles.postcodeData}>{this.state.data.nhs_ha}</Text>
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
  weightContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
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
