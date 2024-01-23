package main

import (
	"fmt"

	"github.com/NathanFirmo/scrapping-platform/worker/internal/db"
	"github.com/gocolly/colly"
)

type WebSite struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"descripton,omitempty"`
}

type Restaurant struct {
	Name    string
	Cuisine string `bson:"cuisine,omitempty"`
}

func main() {
	db.Connect()

	c := colly.NewCollector()

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		e.Response.Save("search-response.html")

		title := e.ChildText("div div h3")

		if title == "" {
			return
		}

		db.Save(WebSite{
			Url:        e.Attr("href"),
			Title:      title,
			Descripton: e.DOM.Parent().Next().Text(),
		})
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.Visit("https://www.google.com.br/search?q=golang")
}
