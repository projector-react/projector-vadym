export enum MainCategorie {
    All = 'All',
    Popular = 'Popular',
    Free = 'Free',
    Restream = 'Restream',
    History = 'History',
    Favorites = 'Favorites'
}

export enum DirectionQuery {
    All = 'All',
    InterfaceDesign = 'InterfaceDesign',
    Graphics = 'Graphics',
    DevAndDataScience = 'DevAndDataScience',
    Marketing = 'Marketing',
    Management = 'Management',
    Humanitarium = 'Humanitarium',
    Advertising = 'Advertising'
}

export enum FormatQuery {
    All = 'All',
    Conference = 'Conference',
    Video = 'Video',
    Tutorial = 'Tutorial',
    Interview = 'Interview'
}

export enum LevelQuery {
    All = 'All',
    Beginner = 'Beginner',
    Pro = 'Pro'
}

export type SearchQuery = {
    readonly mainCategories?: MainCategorie
    readonly directions?: DirectionQuery
    readonly format?: FormatQuery
    readonly level?: LevelQuery
}

export type LibrarySearchState = {
    readonly searchQuery: SearchQuery
}

export type Author = {
    readonly firstName: string
    readonly lastName: string
    readonly position: string
    readonly company: string
    readonly companyLink?: string
}

export type LibraryVideo = {
    readonly placeholderSrc: string
    readonly link: string
    readonly author: Author
    readonly date: string
    readonly title: string
    readonly timing: string
    readonly direction: DirectionQuery
    readonly format: FormatQuery
    readonly category: MainCategorie
    readonly level: LevelQuery
    readonly description: string
}

export interface LibraryVideosService {
    getVideos: (query: SearchQuery) => Promise<LibraryVideo[]>
}
