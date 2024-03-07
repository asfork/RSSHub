import got from '@/utils/got';
import cache from './cache';
import utils from './utils';
import { config } from '@/config';

export default async (ctx) => {
    const uid = ctx.req.param('uid');
    const disableEmbed = ctx.req.param('disableEmbed');
    const name = await cache.getUsernameFromUID(uid);

    const response = await got({
        method: 'get',
        url: `https://api.bilibili.com/x/v2/fav/video?vmid=${uid}&ps=30&tid=0&keyword=&pn=1&order=fav_time`,
        headers: {
            Referer: `https://space.bilibili.com/${uid}/#/favlist`,
            Cookie: config.bilibili.cookies[uid],
        },
    });
    const data = response.data;

    ctx.set('data', {
        title: `${name} 的 bilibili 收藏夹`,
        link: `https://space.bilibili.com/${uid}/#/favlist`,
        description: `${name} 的 bilibili 收藏夹`,

        item:
            data.data &&
            data.data.archives &&
            data.data.archives.map((item) => ({
                title: item.title,
                description: `${item.desc}${disableEmbed ? '' : `<br><br>${utils.iframe(item.aid)}`}<br><img src="${item.pic}">`,
                pubDate: new Date(item.fav_at * 1000).toUTCString(),
                link: item.fav_at > utils.bvidTime && item.bvid ? `https://www.bilibili.com/video/${item.bvid}` : `https://www.bilibili.com/video/av${item.aid}`,
                author: item.owner.name,
            })),
    });
};
