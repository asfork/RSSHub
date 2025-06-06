import { Route, ViewType } from '@/types';

import got from '@/utils/got';
import { load } from 'cheerio';
import path from 'node:path';
import { art } from '@/utils/render';

export const route: Route = {
    path: '/monthly-games',
    categories: ['game'],
    view: ViewType.Notifications,
    example: '/ps/monthly-games',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['www.playstation.com/en-sg/ps-plus/whats-new'],
        },
    ],
    name: 'PlayStation Monthly Games',
    maintainers: ['justjustCC'],
    handler,
    url: 'www.playstation.com/en-sg/ps-plus/whats-new',
};

async function handler() {
    const baseUrl = 'https://www.playstation.com/en-sg/ps-plus/whats-new/';

    const { data: response } = await got(baseUrl);
    const $ = load(response);

    const list = $('#monthly-games .box--light ')
        .toArray()
        .map((e) => {
            const item = $(e);
            return {
                title: item.find('h3').text(),
                description: art(path.join(__dirname, 'templates/monthly-games.art'), {
                    img: item.find('.media-block__img source').attr('srcset'),
                    text: item.find('h3 + p').text(),
                }),
                link: item.find('.btn--cta').attr('href'),
            };
        });

    return {
        title: 'PlayStation Plus Monthly Games',
        link: baseUrl,
        item: list,
    };
}
