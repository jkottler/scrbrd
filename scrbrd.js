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
    'click .inc-score': function(event) {
      self = Template.currentData();
      Meteor.call("inc_score", self._id, this.name);
    },
    'submit .new-player': function(event) {
      event.preventDefault();
      self = Template.currentData();
      new_name = event.target.text.value;
      Games.update(self._id, {$push:{players:{name:new_name, wins:0}}});
      event.target.text.value = "";
    }
  });

  Template.games.events({
    'submit .new-game': function(event) {
      event.preventDefault();
      new_game = event.target.text.value;
      Games.insert({title: new_game, players:[]});
      event.target.text.value = "";
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}
