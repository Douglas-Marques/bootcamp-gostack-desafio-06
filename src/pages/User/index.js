import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './Styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: true,
      page: 1,
      fim: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  handleNavigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repo });
  };

  async loadMore(user) {
    const { stars, page, loading, fim } = this.state;

    if (loading || fim) return;

    this.setState({ loading: true });

    const response = await api.get(
      `users/${user.login}/starred?page=${page + 1}`
    );

    if (response.data.length === 0)
      this.setState({ loading: false, fim: true });
    else
      this.setState({
        stars: [...stars, ...response.data],
        loading: false,
        page: page + 1,
      });
  }

  async refreshList(user) {
    const response = await api.get(`users/${user.login}/starred?page=1`);

    this.setState({
      stars: response.data,
      loading: false,
      fim: false,
      page: 1,
    });
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={() => this.loadMore(user)}
          onRefresh={() => this.refreshList(user)}
          refreshing={loading}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => this.handleNavigate(item)}>
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            </TouchableHighlight>
          )}
        />
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
