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
	if _, err = os.Stat(".env"); err == nil {
		godotenv.Load()
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

	if err := client.Database("scrapping-platform").Collection("config").Drop(context.TODO()); err != nil {
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

func SaveDocument(i struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"description,omitempty"`
}) {
	coll := client.Database("scrapping-platform").Collection("websites")

	srvlog.Info("Saving document", "title", i.Title)
	_, err := coll.InsertOne(context.TODO(), i)

	if err != nil {
		panic(err)
	}
}

func SaveExecution(i struct {
	Date    string `bson:"date,omitempty"`
	Keyword string `bson:"keyword,omitempty"`
}) {
	coll := client.Database("scrapping-platform").Collection("runs")

	srvlog.Info("Saving execution", "date", i.Date)
	_, err := coll.InsertOne(context.TODO(), i)

	if err != nil {
		panic(err)
	}
}

func SaveConfigChange(i struct {
	CronExpression string `bson:"cronExpression,omitempty"`
	Keyword        string `bson:"keyword,omitempty"`
}) {
	if err := client.Database("scrapping-platform").Collection("config").Drop(context.TODO()); err != nil {
		panic(err)
	}

	coll := client.Database("scrapping-platform").Collection("config")

	srvlog.Info("Saving config", "key", i.Keyword, "cron", i.CronExpression)
	_, err := coll.InsertOne(context.TODO(), i)

	if err != nil {
		panic(err)
	}
}
