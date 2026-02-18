@extends('layouts.app')
@section('title', 'Quote')
@section('content')
<div class='container mx-auto px-4 py-8'><h1 class='text-2xl font-bold'>{{ $quote->content }}</h1></div>
@endsection