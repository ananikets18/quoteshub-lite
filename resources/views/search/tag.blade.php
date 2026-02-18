@extends('layouts.app')
@section('title', 'Tag')
@section('content')
<div class='container mx-auto px-4 py-8'><h1 class='text-2xl font-bold'>#{{ $tag->name }}</h1></div>
@endsection