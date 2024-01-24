package db

import (
	"context"
	"os"

	log "github.com/inconshreveable/log15"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var srvlog = log.New("service", "database-connection")

func Connect() {
	var err error
	err = godotenv.Load()

	if err != nil {
		panic(err)
	}

	var uri = os.Getenv("MONGODB_URI")

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	client, err = mongo.Connect(context.TODO(), opts)

	if err != nil {
		panic(err)
	}

	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Decode(&result); err != nil {
		panic(err)
	}

	if err := client.Database("scrapping-platform").Collection("websites").Drop(context.TODO()); err != nil {
		panic(err)
	}

	srvlog.Info("Successfully connected to MongoDB!", "uri", uri)
}

func Disconnect() {
	srvlog.Info("Successfully disconnected from MongoDB!")
	if err := client.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}

func Save(document struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"descripton,omitempty"`
}) {
	coll := client.Database("scrapping-platform").Collection("websites")

	srvlog.Info("Saving document", "title", document.Title)
	_, err := coll.InsertOne(context.TODO(), document)

	if err != nil {
		panic(err)
	}
}
