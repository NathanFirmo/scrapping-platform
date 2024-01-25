package runner

import (
	"fmt"
	"strings"
	"time"

	"github.com/NathanFirmo/scrapping-platform/worker/internal/db"
	colly "github.com/gocolly/colly/v2"
	log "github.com/inconshreveable/log15"
	"github.com/robfig/cron"
)

var srvlog = log.New("service", "scrapper")

type WebSite struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"description,omitempty"`
}

type RunnerExecution struct {
	Date    string `bson:"date,omitempty"`
	Keyword string `bson:"keyword,omitempty"`
}

type Runner struct {
	Collector      *colly.Collector
	Cron           *cron.Cron
	CronExpression string
	Keyword        string
}

func (r *Runner) Run() {
  url := strings.ReplaceAll("https://www.google.com.br/search?q=" + r.Keyword, " ", "+")
  err := r.Collector.Visit(url)

	if err != nil {
		fmt.Printf("Failed to visit %s: %v\n", url, err)
	}

	db.SaveExecution(RunnerExecution{
		Keyword: url,
		Date:    time.Now().Format("2006-01-02 15:04:05"),
	})
}

func (r *Runner) UpdateKeyword(k string) {
	r.Keyword = k
	srvlog.Info("Updating keyword", "from", r.Keyword, "to", r.Keyword)

	db.SaveConfigChange(struct {
		CronExpression string `bson:"cronExpression,omitempty"`
		Keyword        string `bson:"keyword,omitempty"`
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Run()
}

func (r *Runner) UpdateCron(i string) {
	srvlog.Info("Updating cron", "from", r.CronExpression, "to", i)

	r.CronExpression = i

	db.SaveConfigChange(struct {
		CronExpression string `bson:"cronExpression,omitempty"`
		Keyword        string `bson:"keyword,omitempty"`
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Cron.Stop()
	r.Cron = cron.New()
	r.Cron.AddFunc(r.CronExpression, func() {
		r.Run()
	})
	r.Cron.Start()
}

func Create() *Runner {
	c := colly.NewCollector()
	c.AllowURLRevisit = true

	cron := cron.New()

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		title := e.ChildText("div div h3")

		if title == "" {
			return
		}

		db.SaveDocument(WebSite{
			Url:        e.Attr("href"),
			Title:      title,
			Descripton: e.DOM.Parent().Next().Text(),
		})
	})

	c.OnRequest(func(r *colly.Request) {
		srvlog.Info("Visiting url " + r.URL.String())

    for key, values := range *r.Headers {
        fmt.Printf("Header: %s\n", key)
        
        for _, value := range values {
            fmt.Printf("  Value: %s\n", value)
        }
    }
	})

	r := &Runner{
		Collector:      c,
		Keyword:        "golang crawler",
		CronExpression: "0 0 * * *",
		Cron:           cron,
	}

	db.SaveConfigChange(struct {
		CronExpression string "bson:\"cronExpression,omitempty\""
		Keyword        string "bson:\"keyword,omitempty\""
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Cron.AddFunc(r.CronExpression, func() {
		r.Run()
	})

	cron.Start()

  r.Run()

	return r
}
