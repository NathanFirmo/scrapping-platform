package runner

import (
	"github.com/NathanFirmo/scrapping-platform/worker/internal/db"
	"github.com/gocolly/colly"
	log "github.com/inconshreveable/log15"
)

var srvlog = log.New("service", "scrapper")

type WebSite struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"descripton,omitempty"`
}

type Runner struct {
	Collector      *colly.Collector
	CronExpression string
	Keyword        string
}

func (r *Runner) UpdateKeyword(k string) {
	srvlog.Info("Updating keyword", "from", r.Keyword, "to", k)
	r.Keyword = k
	r.Collector.Visit("https://www.google.com.br/search?q=" + k)
}

func Create() *Runner {

	c := colly.NewCollector()

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
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
		srvlog.Info("Saving document", "url", r.URL.String())
	})

	r := &Runner{
		Collector:      c,
		Keyword:        "",
		CronExpression: "",
	}

	return r
}
