const UsersHelper = {};

UsersHelper.usersPath = () => "/users";
UsersHelper.usersShowPath = id => `/users/${id}`;

module.exports = UsersHelper;
