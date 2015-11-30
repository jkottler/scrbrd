Games = new Mongo.Collection("games");

Meteor.methods({
  inc_score: function(game_id, player_name, value) {
    Games.update({_id: game_id, "players.name":player_name}, {$inc: {"players.$.wins": value}});
  },
  add_player: function(game_id, player) {
    Games.update(game_id, {$push:{players:{name:player, wins:0}}});
  },
  remove_player: function(game_id, player) {
    Games.update(game_id, {$pull:{players:{name:player}}});
  },
  add_game: function(title) {
    Games.insert({title: title, players: []});
  },
  remove_game: function(game_id) {
    Games.remove(game_id);
  }
});

if (Meteor.isClient) {
  Meteor.subscribe("games");

  Template.games.helpers({
    games: function() {
      return Games.find({});
    }
  });

  Template.players.events({
    'click .inc-score': function(event, template) {
      Meteor.call("inc_score", template.data._id, this.name, 1);
    },
    'submit .new-player': function(event, template) {
      event.preventDefault();
      new_player = event.target.text.value;
      Meteor.call("add_player", template.data._id, new_player);
      event.target.text.value = "";
    },
    'click .dec-score': function(event, template) {
      Meteor.call("inc_score", template.data._id, this.name, -1);
    },
    'click .remove-player': function(event, template) {
      event.preventDefault();
      Meteor.call("remove_player", template.data._id, this.name);
    }
  });

  Template.games.events({
    'submit .new-game': function(event) {
      event.preventDefault();
      new_game = event.target.text.value;
      Meteor.call("add_game", new_game);
      event.target.text.value = "";
    },
    'click .remove-game': function(event) {
      event.preventDefault();
      Meteor.call("remove_game", this._id);
    }
  });

  Template.body.events({
    'change .edit-mode': function(event) {
      Session.set("editMode", event.target.checked);
    }
  });

  
  Template.registerHelper('editMode', function() {
    return Session.get('editMode');
  });
}

if (Meteor.isServer) {
  Meteor.publish("games", function() {
    return Games.find();
  });

  Meteor.startup(function () {

  });
}
