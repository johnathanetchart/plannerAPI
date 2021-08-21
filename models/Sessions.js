const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sessions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Phase',
        key: 'id'
      }
    },
    mesocycle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Mesocycle',
        key: 'id'
      }
    },
    microcycle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Microcycle',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Sessions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Sessions_fk0",
        using: "BTREE",
        fields: [
          { name: "phase_id" },
        ]
      },
      {
        name: "Sessions_fk1",
        using: "BTREE",
        fields: [
          { name: "mesocycle_id" },
        ]
      },
      {
        name: "Sessions_fk2",
        using: "BTREE",
        fields: [
          { name: "microcycle_id" },
        ]
      },
      {
        name: "Sessions_fk3",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
