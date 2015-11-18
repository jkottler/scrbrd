Games = new Mongo.Collection("games");

Meteor.methods({
  inc_score: function(game_id, player_name, value) {
    Games.update({_id: game_id, "players.name":player_name}, {$inc: {"players.$.wins": value}});
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
      Meteor.call("inc_score", self._id, this.name, 1);
    },
    'submit .new-player': function(event) {
      event.preventDefault();
      self = Template.currentData();
      new_name = event.target.text.value;
      Games.update(self._id, {$push:{players:{name:new_name, wins:0}}});
      event.target.text.value = "";
    },
    'click .dec-score': function(event) {
      self = Template.currentData();
      Meteor.call("inc_score", self._id, this.name, -1);
    },
    'click .remove-player': function(event) {
      event.preventDefault();
      self = Template.currentData();
      Games.update(self._id, {$pull:{players:{name:this.name}}});
    }
  });

  Template.games.events({
    'submit .new-game': function(event) {
      event.preventDefault();
      new_game = event.target.text.value;
      Games.insert({title: new_game, players:[]});
      event.target.text.value = "";
    },
    'click .remove-game': function(event) {
      event.preventDefault();
      console.log("removing game");
      Games.remove(this._id);
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
  Meteor.startup(function () {

  });
}
