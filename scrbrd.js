Games = new Mongo.Collection("games");

Meteor.methods({
  inc_score: function(game_id, player_name) {
    Games.update({_id: game_id, "players.name":player_name}, {$inc: {"players.$.wins": 1}});
  }
});

if (Meteor.isClient) {
  Template.games.helpers({
    games: function() {
      return Games.find({});
    }
  });

  Template.players.events({
    'click .inc_score': function(event) {
      self = Template.currentData();
      Meteor.call("inc_score", self._id, this.name);
    },
    'click .add_player': function(event) {
      console.log("add player");
    }
  });

  Template.games.events({
    'click .add_game': function(event) {
      console.log("add game");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Games.find({}).count() === 0) {
      console.log("No games found\n");
      init_games();
    }
  });
}

function init_games() {
  console.log("should be creating new game instances");
  Games.insert({title: "Puerto Rico", players: [
    {name: "Jason", wins: 1},
    {name: "Jona", wins: 1}
    ]});
}