/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';

module.exports = ResponseObject;

const rxContentType = /^content-type$/i;
const rxLinkName = /^[a-zA-Z0-9.\-_]+$/;

function ResponseObject(data) {
    const Link = require('./link');
    const Header = require('./header');
    const MediaType = require('./media-type');
    const Schema = require('./schema');
    const { major } = data;
    Object.assign(this, {
        type: 'object',
        properties: {
            description: {
                type: 'string',
                required: true
            },
            content: {
                allowed: major === 3,
                type: 'object',
                additionalProperties: function(data) {
                    const mediaType = new MediaType(data);
                    if (!MediaType.rx.mediaType.test(data.key)) {
                        data.warn('Media type appears invalid');
                    }
                    return mediaType;
                }
            },
            examples: {
                allowed: major === 2,
                type: 'object',
                additionalProperties: true
            },
            headers: {
                type: 'object',
                additionalProperties: function(data) {
                    const header = new Header(data);
                    header.ignore = rxContentType.test(data.key);
                    return header;
                }
            },
            links: {
                allowed: major === 3,
                type: 'object',
                additionalProperties: function(data) {
                    const link = new Link(data);
                    const { key } = data;
                    link.allowed = rxLinkName.test(key)
                        ? true
                        : 'Invalid key used for link value';
                    return link;
                }
            },
            schema: function(data) {
                return major === 2
                    ? new Schema(data)
                    : { allowed: false };
            }
        }
    });
}