'use strict';

export interface ISwaggerConfigInterface {
    path?: string;
    title: string;
    description?: string;
    version: string;
    scheme: 'http' | 'https';
}
